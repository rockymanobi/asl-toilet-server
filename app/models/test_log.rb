class TestLog < ActiveRecord::Base

  scope :date_at, ->( date ){
    test_logs = TestLog.arel_table
    where( test_logs[:created_at].lteq( date.end_of_day ) ).
      where( test_logs[:created_at].gteq( date.beginning_of_day) )
  }

  class << self

    def create_repo_data( options )

      stall_name = options[:stall_name]
      till = options[:till] 
      from = options[:from] 

      a = StatisticsService.hoge( { till: till } )
      test_logs = TestLog.arel_table

      logs = TestLog.where( stall_name: stall_name ).where( test_logs[:created_at].lteq( till ) )
      logs = logs.where( test_logs[:created_at].gteq( from ) ) if from.present?
      logs = logs.order(:created_at)

      logs.all.each do |log|
        a.add( log )
      end

      a

    end

    def report( options = {} )

default_result = <<"EOS"
status,amount
vacant,0
occupied,0
unknown,100
EOS

      a = TestLog.create_repo_data( options )

      return default_result unless a.intervals.present?

      vacant = a.intervals.select{|i| i.status == "vacant" }.map(&:interval).inject(0){ |sum, i| sum + i } 
      unknown = a.intervals.select{|i| i.status == "unknown" }.map(&:interval).inject(0){ |sum, i| sum + i } 
      occupied = a.intervals.select{|i| i.status == "occupied" }.map(&:interval).inject(0){ |sum, i| sum + i } 

s = <<"EOS"
status,amount
vacant,#{vacant}
occupied,#{occupied}
unknown,#{unknown}
EOS

      return s
    end

    def percent( options = {} )
      a = TestLog.create_repo_data( options )
      return 0 unless a.intervals.present?

      vacant = a.intervals.select{|i| i.status == "vacant" }.map(&:interval).inject(0){ |sum, i| sum + i } 
      unknown = a.intervals.select{|i| i.status == "unknown" }.map(&:interval).inject(0){ |sum, i| sum + i } 
      occupied = a.intervals.select{|i| i.status == "occupied" }.map(&:interval).inject(0){ |sum, i| sum + i } 

      total = Float( vacant + unknown + occupied )
      avairable = Float( vacant + unknown )

      return ((avairable  / total ) * 100 ).floor

    end

  end


end
